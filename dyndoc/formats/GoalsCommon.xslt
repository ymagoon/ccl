<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="8.0"?>

<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:dd="DynamicDocumentation"
    xmlns:goalfx="urn:com-cerner-physician-documentation-goals-functions"
    exclude-result-prefixes="xsl xs fn n dd">

    <!-- This is an abstract file that requires consumers to implement a template named displayGoal
    which assumes a goal element is in context and writes the goal to the UI. -->

    <!-- Current date time will be populated with the service date time of the document. This will be
    used to calculate the date time value which is 24 hours prior to the current service date time. -->
    <xsl:variable name="lCurrentDateTime" as="xs:dateTime" select="current-dateTime()"/>

    <!-- Calculate the date time that was 24 hours prior to the current date time.
    pendingDateTimeThreshold will be compared with the update-dt-tm of met status goals results and
    only goals that have been updated within 24 hours of the current time will be displayed. -->
    <xsl:variable name="updateDateTimeThreshold" as="xs:dateTime" select="$lCurrentDateTime - xs:dayTimeDuration('PT24H')"/>

    <!-- Call from main template. Generic logic to sort goals, consumers of this format shall
    implement the displayGoal template in an emr content specific format -->
    <xsl:template name="emitGoals">

        <!-- Currently there is no clear and completely accurate way to determine a goal's status
        (Active, Met, Future). This implementation attempts to accurately group goals into their correct
        status categories.-->

        <xsl:choose>

            <xsl:when test="n:report/n:clinical-data/n:goal-data/n:goal">

                <!-- Iterate through each goal and sort by priority. 'Not Met' status goals are displayed
                first so we find all goals with is-met=false. -->
                <xsl:for-each select="n:report/n:clinical-data/n:goal-data/n:goal[@is-met!='true']">
                    <xsl:sort select="@priority"/>

                    <xsl:if test="n:start-dt-tm/text() &lt;= $lCurrentDateTime">
                        <xsl:call-template name="displayGoal"/>
                    </xsl:if>
                </xsl:for-each>

                <!--Iterate through each goal and sort them by update-dt-tm ascending. 'Met' status goals
                are displayed next, so we find all goals with is-met=true. -->
                <xsl:for-each select="n:report/n:clinical-data/n:goal-data/n:goal[@is-met='true']">

                    <xsl:sort select="n:update-dt-tm/text()" order="descending"/>
                    <!--We only want to display goals updated in the last 24 hours so we check to see if each
                    goal was updated in that time frame.-->

                    <xsl:variable name="goal-update-tm" as="xs:dateTime" select="n:update-dt-tm/text()"/>

                    <xsl:variable name="goal-start-tm" as="xs:dateTime" select="n:start-dt-tm/text()"/>

                    <xsl:if test="$goal-update-tm &gt;= $updateDateTimeThreshold and
                        $goal-update-tm &lt;= $lCurrentDateTime and
                        $goal-start-tm &lt;= $lCurrentDateTime">
                        <xsl:call-template name="displayGoal"/>
                    </xsl:if>
                </xsl:for-each>

                <!--Iterate through each goal and sort them by start-dt-tm. Future goals are displayed
                next, so we find all goals with start-dt-time >= the current datetime -->
                <xsl:for-each select="n:report/n:clinical-data/n:goal-data/n:goal">

                    <xsl:sort select="n:start-dt-tm/text()"/>

                    <xsl:if test="n:start-dt-tm &gt; $lCurrentDateTime">
                        <xsl:call-template name="displayGoal"/>
                    </xsl:if>
                </xsl:for-each>
            </xsl:when>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
